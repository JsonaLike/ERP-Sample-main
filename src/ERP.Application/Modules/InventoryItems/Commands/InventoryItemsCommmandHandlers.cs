using ERP.Application.Core;
using ERP.Application.Core.Models;
using ERP.Application.Modules.Departments.Queries;
using ERP.Application.Modules.Designations.Commands;
using ERP.Application.Modules.Designations.Queries;
using ERP.Application.Modules.InventoryItems.Queries;
using ERP.Domain.Core.Repositories;
using ERP.Domain.Core.Services;
using ERP.Domain.Modules.Designations;
using ERP.Domain.Modules.Employees;
using ERP.Domain.Modules.InventoryItems;
using ERP.Domain.Modules.Leaves;
using Mapster;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ERP.Application.Modules.InventoryItems.Commands
{
    public class VendorsCommmandHandlers : BaseCommandHandler,
        IRequestHandler<CreateInventoryItemCommand, Guid>,
         IRequestHandler<UpdateInventoryItemCommand, Guid>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger _logger;
        public VendorsCommmandHandlers(IMediator mediator, IUserContext userContext, IUnitOfWork unitOfWork, ILogger<VendorsCommmandHandlers> logger) : base(mediator, userContext)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<Guid> Handle(CreateInventoryItemCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var newInventoryItem = InventoryItem.CreateInventoryItem(request.Name, request.Description, request.Price, request.Quantity,GetCurrentEmployeeId());
                InventoryItem InvItem = await _unitOfWork.Repository<InventoryItem>().AddAsync(newInventoryItem);
                await _unitOfWork.SaveChangesAsync();
                return InvItem.Id;
            }
            catch (Exception ex) {
                throw new Exception(ex.ToString());
            }
            throw new NotSupportedException();
            return new Guid();
        }
        public async Task<Guid> Handle(UpdateInventoryItemCommand request, CancellationToken cancellationToken)
        {
            _logger.LogError("request.id:"+ request.Id);
            var spec = InventoryItemSpecification.GetInventoryItemByIdSpec(request.Id);
            InventoryItem inventoryItem = await _unitOfWork.Repository<InventoryItem>().SingleAsync(spec, false);
            inventoryItem = request.Adapt(inventoryItem);
            _unitOfWork.Repository<InventoryItem>().Update(inventoryItem);
            
            await _unitOfWork.SaveChangesAsync();
           
            return new Guid();
        }
    }

}
