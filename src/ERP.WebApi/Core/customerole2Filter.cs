using ERP.Domain.Core.Repositories;
using ERP.Domain.Core.Services;
using ERP.Domain.Core.Specifications;
using ERP.Domain.Enums;
using ERP.Domain.Modules.Users;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace ERP.WebApi.Core
{
    public class customerole2Filter : Attribute, IAuthorizationFilter
    {
        private readonly PermissionEnum _permission;
        IUserContext? _userContext;
        IUnitOfWork? _unitOfWork;
        ILoggerService? _loggerService;
        public customerole2Filter(PermissionEnum permission)
        {
            _permission = permission;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            // Adding try catch here as Authorization filter run first, 
            // and Exception filter is not able to handler exception here
            try
            {
                
                _userContext = context.HttpContext.RequestServices.GetService<IUserContext>();
                _unitOfWork = context.HttpContext.RequestServices.GetService<IUnitOfWork>();
                _loggerService = context.HttpContext.RequestServices.GetService<ILoggerService>();

                if (_userContext == null || _unitOfWork == null || _loggerService == null)
                {
                    context.Result = new StatusCodeResult(500);
                    return;
                }
                // skip authorization if action is decorated with [AllowAnonymous] attribute
                var allowAnonymous = context.ActionDescriptor.EndpointMetadata.OfType<AllowAnonymousAttribute>().Any();
                if (allowAnonymous)
                    return;

                var employeeId = _userContext.GetCurrentEmployeeId();
                BaseSpecification<User> spec = UserSpecifications.GetUserByEmployeeIdSpec(employeeId);
                spec.AddInclude("UserRoles");
                spec.AddInclude("UserRoles.Role");
                spec.AddInclude("UserRoles.Role.RolePermissions");
                var user = _unitOfWork.Repository<User>().SingleAsync(spec, false).ConfigureAwait(false).GetAwaiter().GetResult();
                if (user.IsSuperUser)
                {
                    return;
                }
                var permissions = new List<int>();
                foreach (var UserRole in user.UserRoles)
                {
                    permissions.AddRange(UserRole.Role.RolePermissions.Select(x => x.PermissionId));
                }
                if (permissions.Any(x => x == (int)_permission))
                {
                    return;
                }
                context.Result = new ForbidResult();
            }
            catch (Exception ex)
            {
                if (_loggerService != null)
                {
                    _loggerService.LogException(ex);
                }
                context.Result = new ForbidResult();
            }
        }
    }
}