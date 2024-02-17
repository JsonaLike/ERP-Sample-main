

namespace ERP.Domain.Dto
{
    public class PurchaseOrderItemDto
    {
        public Guid InventoryItemId { get; set; }
        public decimal Quantity { get; set; }
        public long Price { get; set; }
    }
}
