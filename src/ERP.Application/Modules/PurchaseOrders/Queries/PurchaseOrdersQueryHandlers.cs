using ERP.Application.Modules.PurchaseOrders.Queries;
using ERP.Domain.Core.Repositories;
using ERP.Domain.Core.Specifications;
using ERP.Domain.Modules.PurchaseOrderItems;
using ERP.Domain.Modules.PurchaseOrders;
using ERP.Infrastructure.Data;
using ERP.Infrastructure.Repositories;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ERP.Application.Modules.InventoryItems.Queries
{
    public class PurchaseOrdersQueryHandlers :
        IRequestHandler<GetAllPurchaseOrdersReq, GetAllPurchaseOrdersRes>,
        IRequestHandler<GetPurchaseOrderByIdReq, PurchaseOrder>,
        IRequestHandler<GetPurchaserOrderItemsByIdReq, GetAllPurchaseOrderItemsRes>
    {
        private readonly IUnitOfWork _unitOfWork;
        protected readonly ERPDbContext _dbContext;
        public PurchaseOrdersQueryHandlers(ERPDbContext dbContext, IUnitOfWork unitOfWork)
        {
            _dbContext = dbContext;
            _unitOfWork = unitOfWork;
        }
        public async Task<PurchaseOrder> Handle(GetPurchaseOrderByIdReq request, CancellationToken cancellationToken)
        {
            var spec = PurchaseOrderSpecifications.GetPurchaseOrderByIdSpec(request.Id);
            return await _unitOfWork.Repository<PurchaseOrder>().SingleAsync(spec, false);
        }

        public async Task<GetAllPurchaseOrdersRes> Handle(GetAllPurchaseOrdersReq request, CancellationToken cancellationToken)
        {
            BaseSpecification<PurchaseOrder> spec;
          /*  if (!string.IsNullOrWhiteSpace(request.SearchKeyword))
            {
                spec = PurchaseOrderSpecifications.SearchPurchaseOrdersSpec(request.SearchKeyword);
            }
            else
            {*/
                spec = PurchaseOrderSpecifications.GetAllPurchaseOrdersSpec();
            //}
            if (request.PageSize > 0)
            {
                spec.ApplyPaging((request.PageIndex * request.PageSize), request.PageSize);
            }
            IList<PurchaseOrder> list = await ApplySpecification(spec).AsNoTracking().ToListAsync();
            var data = await _unitOfWork.Repository<PurchaseOrder>().ListAsync(spec, false);
            
            return new GetAllPurchaseOrdersRes
            {
                PurchaseOrders = data,
            };

        }

        public async Task<GetAllPurchaseOrderItemsRes> Handle(GetPurchaserOrderItemsByIdReq request, CancellationToken cancellationToken)
        {
            var spec = PurchaseOrderSpecifications.GetPurchaseOrderItemsByIdSpec(request.Id);
            var data = await _unitOfWork.Repository<PurchaseOrderItem>().ListAsync(spec, false);
            return new GetAllPurchaseOrderItemsRes
            {
                PurchaseOrdersItems = data,
            };
        }

        public IQueryable<PurchaseOrder> ApplySpecification(ISpecification<PurchaseOrder> spec)
        {
            return SpecificationEvaluator<PurchaseOrder>.GetQuery(_dbContext.Set<PurchaseOrder>().AsQueryable(), spec);
        }


       
    }
}
