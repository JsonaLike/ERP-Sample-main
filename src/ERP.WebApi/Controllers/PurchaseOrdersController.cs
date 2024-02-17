using ERP.Application.Modules.PurchaseOrders.Commands;
using ERP.Application.Modules.PurchaseOrders.Queries;
using ERP.Domain.Enums;
using ERP.Domain.Modules.PurchaseOrders;
using ERP.WebApi.Core;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERP.WebApi.Controllers
{
    [Route("[controller]/[action]")]
    public class PurchaseOrdersController : BaseController
    {
        public PurchaseOrdersController(IMediator _mediator) : base(_mediator)
        {

        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<CustomActionResult> GetAllPurchaseOrders(GetAllPurchaseOrdersReq req)
        {
            var result = await _mediator.Send<GetAllPurchaseOrdersRes>(req);
            return new CustomActionResult(true, null, null, result);
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<CustomActionResult> GetAllPurchaseOrderItems(GetPurchaserOrderItemsByIdReq req)
        {
            var result = await _mediator.Send<GetAllPurchaseOrderItemsRes>(req);
            return new CustomActionResult(true, null, null, result);
        }

        [CustomRoleAuthorizeFilter(PermissionEnum.InventoryItemView)]
        [HttpPost]
        [AllowAnonymous]
        public async Task<CustomActionResult> GetPurchaseOrderById(GetPurchaseOrderByIdReq req)
        {
            var result = await _mediator.Send<PurchaseOrder>(req);
            return new CustomActionResult(true, null, null, result);
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<CustomActionResult> CreatePurchaseOrder(CreatePurchaseOrderCommand req)
        {
            var result = await _mediator.Send<Guid>(req);
            return new CustomActionResult(true, new string[] { "Record created sucessfully." }, null, result);
        }

        [CustomRoleAuthorizeFilter(PermissionEnum.InventoryItemEdit)]
        [HttpPost]
        [AllowAnonymous]
        public async Task<CustomActionResult> UpdatePurchaseOrder([FromBody] UpdatePurchaseOrderCommand req)
        {
            var result = await _mediator.Send<Guid>(req);
            return new CustomActionResult(true, new string[] { "Record updated sucessfully." }, null, result);
        }

        [CustomRoleAuthorizeFilter(PermissionEnum.InventoryItemDelete)]
        [HttpPost]
        [AllowAnonymous]
        public async Task<CustomActionResult> DeletePurchaseOrder(DeletePurchaseOrderCommand req)
        {
            var result = await _mediator.Send<Guid>(req);
            return new CustomActionResult(true, new string[] { "Record removed sucessfully." }, null, result);
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<CustomActionResult> GetAllPurchaseOrderByYear(GetAllPurchaseOrdersByYearReq req)
        {
            var result = await _mediator.Send<IList<PurchaseOrder>>(req);
            return new CustomActionResult(true, null, null, result);
        }
    }
}
