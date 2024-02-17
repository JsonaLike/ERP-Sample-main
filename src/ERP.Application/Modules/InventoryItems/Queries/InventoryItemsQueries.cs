using ERP.Application.Core.Models;
using ERP.Domain.Modules.InventoryItems;
using MediatR;

namespace ERP.Application.Modules.InventoryItems.Queries
{
    public class GetAllInventoryItemsReq : PagedListReq, IRequest<GetAllInventoryItemsRes>
    {
    }
    public class GetAllInventoryItemsRes : PagedListRes<InventoryItem>
    {
        public IEnumerable<InventoryItem> InventoryItems { get; set; }
    }
    public class GetAllInventoryItemByYearReq : IRequest<IList<InventoryItem>>
    {
        DateTimeOffset year;
    }
    public class GetInventoryItemByIdReq : IRequest<InventoryItem> 
    {
        public Guid Id { get; set; }
    }
    public class VendorsQueries
    {
    }
}
