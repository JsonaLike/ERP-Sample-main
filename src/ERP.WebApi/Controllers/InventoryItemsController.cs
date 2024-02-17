using ERP.Application.Modules.InventoryItems.Commands;
using ERP.Application.Modules.InventoryItems.Queries;
using ERP.Application.Modules.Leaves.Commands;
using ERP.Application.Modules.Leaves.Queries;
using ERP.Domain.Enums;
using ERP.Domain.Modules.InventoryItems;
using ERP.Domain.Modules.Leaves;
using ERP.Domain.Modules.Roles;
using ERP.WebApi.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ERP.WebApi.Controllers
{
    [Route("[controller]/[action]")]
    public class InventoryItemsController : BaseController
    {
        public InventoryItemsController(IMediator _mediator) : base(_mediator)
        {

        }

        [HttpPost]
        [customerole2Filter(PermissionEnum.DepartmentAdd)]

        public async Task<CustomActionResult> GetAllInventoryItems(GetAllInventoryItemsReq req)
        {
            var result = await _mediator.Send<GetAllInventoryItemsRes>(req);
            return new CustomActionResult(true, null, null, result);
        }

        [CustomRoleAuthorizeFilter(PermissionEnum.InventoryItemView)]
        [HttpPost]
        public async Task<CustomActionResult> GetInventoryItemById(GetInventoryItemByIdReq req)
        {
            var result = await _mediator.Send<InventoryItem>(req);
            return new CustomActionResult(true, null, null, result);
        }

        [HttpPost]
        public async Task<CustomActionResult> CreateInventoryItem(CreateInventoryItemCommand req)
        {
            var result = await _mediator.Send<Guid>(req);
            return new CustomActionResult(true, new string[] { "Record created sucessfully." }, null, result);
        }

        [CustomRoleAuthorizeFilter(PermissionEnum.InventoryItemEdit)]
        [HttpPost]
        public async Task<CustomActionResult> UpdateInventoryItem(UpdateInventoryItemCommand req)
        {
            var result = await _mediator.Send<Guid>(req);
            return new CustomActionResult(true, new string[] { "Record updated sucessfully." }, null, result);
        }

        [CustomRoleAuthorizeFilter(PermissionEnum.InventoryItemDelete)]
        [HttpPost]
        public async Task<CustomActionResult> DeleteInventoryItem(DeleteInventoryItemCommand req)
        {
            var result = await _mediator.Send<Guid>(req);
            return new CustomActionResult(true, new string[] { "Record removed sucessfully." }, null, result);
        }

        [HttpPost]
        public async Task<CustomActionResult> GetAllInventoryItemByYear(GetAllInventoryItemByYearReq req)
        {
            var result = await _mediator.Send<IList<InventoryItem>>(req);
            return new CustomActionResult(true, null, null, result);
        }
    }
}
