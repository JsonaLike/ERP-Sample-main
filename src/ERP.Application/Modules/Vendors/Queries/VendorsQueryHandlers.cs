using ERP.Domain.Core.Repositories;
using ERP.Domain.Core.Specifications;
using ERP.Domain.Modules.Vendors;
using ERP.Infrastructure.Data;
using ERP.Infrastructure.Repositories;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ERP.Application.Modules.Vendors.Queries
{
    public class VendorsQueryHandlers :
        IRequestHandler<GetAllVendorsReq, GetAllVendorsRes>,
        IRequestHandler<GetVendorByIdReq, Vendor>
    {
        private readonly IUnitOfWork _unitOfWork;
        protected readonly ERPDbContext _dbContext;
        public VendorsQueryHandlers(ERPDbContext dbContext, IUnitOfWork unitOfWork)
        {
            this._dbContext = dbContext;
            this._unitOfWork = unitOfWork;
        }
        public async Task<Vendor> Handle(GetVendorByIdReq request, CancellationToken cancellationToken)
        {
            var spec = VendorSpecifications.GetVendorByIdSpec(request.Id);
            return await _unitOfWork.Repository<Vendor>().SingleAsync(spec, false);
        }

        public async Task<GetAllVendorsRes> Handle(GetAllVendorsReq request, CancellationToken cancellationToken)
        {
            BaseSpecification<Vendor> spec;
            if (!string.IsNullOrWhiteSpace(request.SearchKeyword))
            {
                spec = VendorSpecifications.SearchVendorsSpec(request.SearchKeyword);
            }
            else
            {
                spec = VendorSpecifications.GetAllVendorsSpec();
            }
            if (request.PageSize > 0)
            {
                spec.ApplyPaging((request.PageIndex * request.PageSize), request.PageSize);
            }
            IList<Vendor> list = await ApplySpecification(spec).AsNoTracking().ToListAsync();
            var data = await _unitOfWork.Repository<Vendor>().ListAsync(spec, false);
            
            return new GetAllVendorsRes
            {
                Vendors = data,
            };

        }
        public IQueryable<Vendor> ApplySpecification(ISpecification<Vendor> spec)
        {
            return SpecificationEvaluator<Vendor>.GetQuery(_dbContext.Set<Vendor>().AsQueryable(), spec);
        }

        
    }
}
