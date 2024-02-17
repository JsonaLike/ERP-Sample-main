using ERP.Domain.Dto;
using ERP.Domain.Enums;
using ERP.Domain.Modules.InventoryItems;
using ERP.Domain.Modules.Vendors;
using MediatR;

namespace ERP.Application.Modules.PurchaseOrders.Commands
{
    
        public class CreatePurchaseOrderCommand : IRequest<Guid>
        {
        public DateTime PurchaseOrderDate { get; set; }
        public Guid VendorId { get; set; }
        public string PurchaseOrderNumber { get; set; }
        public string ShippingAddress { get; set; }
        public List<PurchaseOrderItemDto> PurchaseOrderItems { get; set; }
        public PurchaseOrderStatus PurchaserOrderStatus { get; set; }
        public string PurchaserOrderNotes { get; set; }

    }

        public class UpdatePurchaseOrderCommand : IRequest<Guid>
        {
            public Guid Id { get; set; }
            public DateTime PurchaseOrderDate { get; set; }
            public Guid VendorId { get; set; }
            public string PurchaseOrderNumber { get; set; }
            public string ShippingAddress { get; set; }
            public List<PurchaseOrderItemDto> PurchaseOrderItems { get; set; }
            public PurchaseOrderStatus PurchaserOrderStatus { get; set; }
            public string PurchaserOrderNotes { get; set; }
        }

        public class DeletePurchaseOrderCommand : IRequest<Guid>
        {
            public Guid Id { get; set; }
        }
}
