using ERP.Application.Core;
using ERP.Application.Modules.PurchaseOrders.Commands;
using ERP.Domain.Core.Repositories;
using ERP.Domain.Core.Services;
using ERP.Domain.Dto;
using ERP.Domain.Modules.PurchaseOrderItems;
using ERP.Domain.Modules.PurchaseOrders;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ERP.Application.Modules.InventoryItems.Commands
{
    public class PurchaseOrdersCommmandHandlers : BaseCommandHandler,
        IRequestHandler<CreatePurchaseOrderCommand, Guid>,
         IRequestHandler<UpdatePurchaseOrderCommand, Guid>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger _logger;
        public PurchaseOrdersCommmandHandlers(IMediator mediator, IUserContext userContext, IUnitOfWork unitOfWork, ILogger<PurchaseOrdersCommmandHandlers> logger) : base(mediator, userContext)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }
        public async Task<Guid> Handle(UpdatePurchaseOrderCommand request, CancellationToken cancellationToken)
        {
           
            var spec = PurchaseOrderSpecifications.GetPurchaseOrderByIdSpec(request.Id);
            PurchaseOrder purchaseOrder = await _unitOfWork.Repository<PurchaseOrder>().SingleAsync(spec, false);
            Func<List<PurchaseOrderItemDto>,Task<bool>> UpdatePurchaseOrderItems = async(PurchaseOrders) =>
            {
                PurchaseOrderItem purchaseOrderItem;
                foreach (var PoItemDto in PurchaseOrders)
                {
                    var spec = PurchaseOrderSpecifications.GetPurchaseOrderInventoryItemById(request.Id,PoItemDto.InventoryItemId);
                    purchaseOrderItem = await _unitOfWork.Repository<PurchaseOrderItem>().SingleAsync(spec, true);
                    if (purchaseOrderItem != null)
                    {
                        purchaseOrderItem.Price = PoItemDto.Price;
                        purchaseOrderItem.Quantity = PoItemDto.Quantity;
                        // _unitOfWork.Repository<PurchaseOrderItem>().Update(purchaseOrderItem);
                        // _unitOfWork.Repository<PurchaseOrder>().Update(purchaseOrder);
                      //  await _unitOfWork.SaveChangesAsync();
                    }
                    else
                    {
                        await _unitOfWork.Repository<PurchaseOrderItem>().AddAsync(new PurchaseOrderItem()
                        {
                            PurchaseOrderId = request.Id,
                            ItemId = PoItemDto.InventoryItemId,
                            Price = PoItemDto.Price,
                            Quantity = PoItemDto.Quantity
                        });
                    }
                }
                return true;
            };
            // Manually update PurchaseOrder entity
            purchaseOrder.PurchaseOrderDate = request.PurchaseOrderDate;
            purchaseOrder.VendorId = request.VendorId;
            purchaseOrder.PurchaseOrderNumber = request.PurchaseOrderNumber;
            purchaseOrder.ShippingAddress = request.ShippingAddress;
          //  purchaseOrder.PurchaseOrderItems = MapPurchaseOrderItems(request.PurchaseOrderItems); // Assuming you have a method to map items
            purchaseOrder.Status = request.PurchaserOrderStatus;
            purchaseOrder.Notes = request.PurchaserOrderNotes;
             _unitOfWork.Repository<PurchaseOrder>().Update(purchaseOrder);
             await UpdatePurchaseOrderItems(request.PurchaseOrderItems);
             await _unitOfWork.SaveChangesAsync();
            return purchaseOrder.Id; // Return the actual updated PurchaseOrder's Id
        }
        public async Task<Guid> Handle(CreatePurchaseOrderCommand request, CancellationToken cancellationToken)
        {
          
            PurchaseOrder PO = new PurchaseOrder()
            {
                PurchaseOrderDate = request.PurchaseOrderDate,
                Notes = request.PurchaserOrderNotes,
                PurchaseOrderNumber = request.PurchaseOrderNumber,
                Status = request.PurchaserOrderStatus,
                ShippingAddress = request.ShippingAddress,
                VendorId = request.VendorId,
            };
           //// PO.PurchaseOrderItems = new List<PurchaseOrderItem>();
            await _unitOfWork.Repository<PurchaseOrder>().AddAsync(PO);
            await _unitOfWork.SaveChangesAsync();
            var PurchaseOrderItems = new List<PurchaseOrderItem>();
            for (int i = 0; i < request.PurchaseOrderItems.Count; i++)
            {
                var purchaseOrderItem = new PurchaseOrderItem();
                purchaseOrderItem.PurchaseOrderId = PO.Id;
                purchaseOrderItem.ItemId = request.PurchaseOrderItems[i].InventoryItemId;
                purchaseOrderItem.Price = request.PurchaseOrderItems[i].Price;
                purchaseOrderItem.Quantity = request.PurchaseOrderItems[i].Quantity;

                PurchaseOrderItems.Add(purchaseOrderItem);
            }
            
            await _unitOfWork.SaveChangesAsync();
          ////  PO.PurchaseOrderItems = PurchaseOrderItems;
            _unitOfWork.Repository<PurchaseOrder>().Update(PO);
            await _unitOfWork.SaveChangesAsync();

            return PO.Id;
        }
    }

}
