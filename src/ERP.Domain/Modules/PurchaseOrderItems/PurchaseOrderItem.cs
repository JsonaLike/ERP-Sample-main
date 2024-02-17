using ERP.Domain.Core.Models;
using ERP.Domain.Modules.InventoryItems;
using ERP.Domain.Modules.PurchaseOrders;
using System.ComponentModel.DataAnnotations.Schema;

namespace ERP.Domain.Modules.PurchaseOrderItems
{
    public class PurchaseOrderItem: BaseEntity
    {
        public PurchaseOrderItem() { }
        public Guid PurchaseOrderId { get; set; }
        public Guid ItemId { get; set; }
        public PurchaseOrder PurchaseOrder { get; set; } = null!;
        public InventoryItem Item { get; set; } = null!;
        public decimal Quantity { get; set; }
        public long Price { get; set; }
    }
}
