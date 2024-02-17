using ERP.Application.Core.Models;
using ERP.Application.Modules.Dashboard.Queries;
using ERP.Domain.Modules.Vendors;
using ERP.Domain.Modules.Vendors;
using MediatR;

namespace ERP.Application.Modules.Vendors.Queries
{
    public class GetAllVendorsReq : PagedListReq, IRequest<GetAllVendorsRes>
    {
    }
    public class GetAllVendorsRes : PagedListRes<Vendor>
    {
        public IEnumerable<Vendor> Vendors { get; set; }
    }
    public class GetAllVendorByYearReq : IRequest<IList<Vendor>>
    {
        DateTimeOffset year;
    }
    public class GetVendorByIdReq : IRequest<Vendor> 
    {
        public Guid Id { get; set; }
    }
    public class VendorsQueries
    {
    }
}
