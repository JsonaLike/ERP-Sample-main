using ERP.Application.Core;
using ERP.Domain.Core.Repositories;
using ERP.Domain.Core.Services;
using ERP.Domain.Modules.Vendors;
using Mapster;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ERP.Application.Modules.Vendors.Commands
{
    public class VendorsCommmandHandlers : BaseCommandHandler,
        IRequestHandler<CreateVendorCommand, Guid>,
         IRequestHandler<UpdateVendorCommand, Guid>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger _logger;
        public VendorsCommmandHandlers(IMediator mediator, IUserContext userContext, IUnitOfWork unitOfWork, ILogger<VendorsCommmandHandlers> logger) : base(mediator, userContext)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<Guid> Handle(CreateVendorCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var newVendor = Vendor.CreateVendor(request.VendorName, request.VendorAddress, request.VendorCity, request.VendorZipCode, request.VendorCountry, request.VendorPhone, request.VendorEmail, request.ContactName, request.ContactNotes, GetCurrentEmployeeId());
                Vendor InvItem = await _unitOfWork.Repository<Vendor>().AddAsync(newVendor);
                await _unitOfWork.SaveChangesAsync();
                return InvItem.Id;
            }
            catch (Exception ex) {
                throw new Exception(ex.ToString());
            }
            throw new NotSupportedException();
        }
        public async Task<Guid> Handle(UpdateVendorCommand request, CancellationToken cancellationToken)
        {
            var spec = VendorSpecifications.GetVendorByIdSpec(request.Id);
            Vendor inventoryItem = await _unitOfWork.Repository<Vendor>().SingleAsync(spec, false);
            inventoryItem = request.Adapt(inventoryItem);
            _unitOfWork.Repository<Vendor>().Update(inventoryItem);
            
            await _unitOfWork.SaveChangesAsync();
           
            return new Guid();
        }
    }

}
