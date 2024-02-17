using ERP.Domain.Core.Repositories;
using ERP.Domain.Core.Specifications;
using ERP.Domain.Modules.InventoryItems;
using ERP.Infrastructure.Data;
using ERP.Infrastructure.Repositories;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ERP.Application.Modules.InventoryItems.Queries
{
    public class VendorsQueryHandlers :
        IRequestHandler<GetAllInventoryItemsReq, GetAllInventoryItemsRes>,
        IRequestHandler<GetInventoryItemByIdReq, InventoryItem>
    {
        private readonly IUnitOfWork _unitOfWork;
        protected readonly ERPDbContext _dbContext;
        public VendorsQueryHandlers(ERPDbContext dbContext, IUnitOfWork unitOfWork)
        {
            this._dbContext = dbContext;
            this._unitOfWork = unitOfWork;
        }
        public async Task<InventoryItem> Handle(GetInventoryItemByIdReq request, CancellationToken cancellationToken)
        {
            var spec = InventoryItemSpecification.GetInventoryItemByIdSpec(request.Id);
            return await _unitOfWork.Repository<InventoryItem>().SingleAsync(spec, false);
        }

        public async Task<GetAllInventoryItemsRes> Handle(GetAllInventoryItemsReq request, CancellationToken cancellationToken)
        {
            BaseSpecification<InventoryItem> spec;
            if (!string.IsNullOrWhiteSpace(request.SearchKeyword))
            {
                spec = InventoryItemSpecification.SearchInventoryItemsSpec(request.SearchKeyword);
            }
            else
            {
                spec = InventoryItemSpecification.GetAllInventoryItemsSpec();
            }
            if (request.PageSize > 0)
            {
                spec.ApplyPaging((request.PageIndex * request.PageSize), request.PageSize);
            }
            await Console.Out.WriteLineAsync("testing");
            IList<InventoryItem> list = await ApplySpecification(spec).AsNoTracking().ToListAsync();
            var data = await _unitOfWork.Repository<InventoryItem>().ListAsync(spec, false);
            
            return new GetAllInventoryItemsRes
            {
                InventoryItems = data,
            };

        }
        public IQueryable<InventoryItem> ApplySpecification(ISpecification<InventoryItem> spec)
        {
            return SpecificationEvaluator<InventoryItem>.GetQuery(_dbContext.Set<InventoryItem>().AsQueryable(), spec);
        }

        
    }
}
