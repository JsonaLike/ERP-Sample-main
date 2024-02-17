using ERP.Application.Core.Models;
using ERP.Application.Modules.Dashboard.Queries;
using ERP.Domain.Modules.PurchaseOrderItems;
using ERP.Domain.Modules.PurchaseOrders;
using MediatR;

namespace ERP.Application.Modules.PurchaseOrders.Queries
{
    public class GetAllPurchaseOrdersReq : PagedListReq, IRequest<GetAllPurchaseOrdersRes>
    {
    }
    public class GetAllPurchaseOrdersRes : PagedListRes<PurchaseOrder>
    {
        public IEnumerable<PurchaseOrder> PurchaseOrders { get; set; }
    }
    public class GetAllPurchaseOrderItemsRes : PagedListRes<PurchaseOrderItem>
    {
        public IEnumerable<PurchaseOrderItem> PurchaseOrdersItems { get; set; }
    }
    public class GetAllPurchaseOrdersByYearReq : IRequest<IList<PurchaseOrder>>
    {
        DateTimeOffset year;
    }
    public class GetPurchaseOrderByIdReq : IRequest<PurchaseOrder> 
    {
        public Guid Id { get; set; }
    }
    public class GetPurchaserOrderItemsByIdReq : IRequest<GetAllPurchaseOrderItemsRes>
    {
        public Guid Id { get; set; }
    }

}
