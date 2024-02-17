using ERP.Application.Modules.Vendors.Commands;
using ERP.Application.Modules.Vendors.Queries;
using ERP.Domain.Enums;
using ERP.Domain.Modules.Vendors;
using ERP.WebApi.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using static ERP.Application.Modules.Vendors.Commands.UpdateVendorCommand;

namespace ERP.WebApi.Controllers
{
    [Route("[controller]/[action]")]
    public class VendorController : BaseController
    {
        public VendorController(IMediator _mediator) : base(_mediator)
        {

        }

        [HttpPost]
        public async Task<CustomActionResult> GetAllVendors(GetAllVendorsReq req)
        {
            var result = await _mediator.Send<GetAllVendorsRes>(req);
            return new CustomActionResult(true, null, null, result);
        }

        [CustomRoleAuthorizeFilter(PermissionEnum.VendorView)]
        [HttpPost]
        public async Task<CustomActionResult> GetVendorById(GetVendorByIdReq req)
        {
            var result = await _mediator.Send<Vendor>(req);
            return new CustomActionResult(true, null, null, result);
        }

        [HttpPost]
        public async Task<CustomActionResult> CreateVendor(CreateVendorCommand req)
        {
            var result = await _mediator.Send<Guid>(req);
            return new CustomActionResult(true, new string[] { "Record created sucessfully." }, null, result);
        }

        [CustomRoleAuthorizeFilter(PermissionEnum.VendorEdit)]
        [HttpPost]
        public async Task<CustomActionResult> UpdateVendor(UpdateVendorCommand req)
        {
            var result = await _mediator.Send<Guid>(req);
            return new CustomActionResult(true, new string[] { "Record updated sucessfully." }, null, result);
        }

        [CustomRoleAuthorizeFilter(PermissionEnum.VendorDelete)]
        [HttpPost]
        public async Task<CustomActionResult> DeleteVendor(DeleteVendorCommand req)
        {
            var result = await _mediator.Send<Guid>(req);
            return new CustomActionResult(true, new string[] { "Record removed sucessfully." }, null, result);
        }

        [HttpPost]
        public async Task<CustomActionResult> GetAllVendorsByYear(GetAllVendorByYearReq req)
        {
            var result = await _mediator.Send<IList<Vendor>>(req);
            return new CustomActionResult(true, null, null, result);
        }
    }
}
