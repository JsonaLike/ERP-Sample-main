using ERP.Domain.Core.Models;
using ERP.Domain.Enums;
using ERP.Domain.Modules.InventoryItems;
using ERP.Domain.Modules.PurchaseOrderItems;
using ERP.Domain.Modules.Vendors;

namespace ERP.Domain.Modules.PurchaseOrders
{
    public class PurchaseOrder : BaseAuditableEntity
    {
        public Guid Id { get; set; }
        public DateTimeOffset PurchaseOrderDate { get; set; }
        public Vendor Vendor { get; set; }
        public Guid VendorId { get; set; }
        public string PurchaseOrderNumber { get; set; }
        public string ShippingAddress { get; set; }
        public PurchaseOrderStatus Status { get; set; }
        public string Notes { get; set; }
        public List<InventoryItem> InventoryItems { get; set; }
        public static PurchaseOrder CreatePurchaseOrder(Guid vendorId, string purchaseOrderNumber, string shippingAddress,
                                                        PurchaseOrderStatus status, string notes)
        {
            PurchaseOrder PurchaseOrder = new PurchaseOrder();
            PurchaseOrder.PurchaseOrderDate = DateTimeOffset.Now;
            PurchaseOrder.VendorId = vendorId;
            PurchaseOrder.PurchaseOrderNumber = purchaseOrderNumber;
            PurchaseOrder.ShippingAddress = shippingAddress;
            PurchaseOrder.Status = status;
            PurchaseOrder.Notes = notes;

            return PurchaseOrder;
            // Logic to create a purchase order
            // For demonstration purposes, let's assume it generates a unique ID for the purchase order

            // Additional logic to save the purchase order to a database or perform any other necessary operations
        }
    }
}