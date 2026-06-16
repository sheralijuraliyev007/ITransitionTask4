using Microsoft.AspNetCore.Authorization;

namespace ITransitionTask4.Middlewares
{
    public class RequestMiddleware
    {
        private readonly RequestDelegate _next;
        

        public RequestMiddleware(RequestDelegate next)
        {
            _next = next;
            
        }
        public async Task InvokeAsync(HttpContext context, IUserRepository _userRepository)
        {
            var endpoint = context.GetEndpoint();
            var requiresAttribute = endpoint?.Metadata.GetMetadata<AllowAnonymousAttribute>();

            if (requiresAttribute != null) {
                await _next(context);
                return;
            }
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                context.Response.StatusCode = 401;
                return;
            }
            var user = await _userRepository.GetAll().Where(u => u.Id == Guid.Parse(userId)).FirstOrDefaultAsync();

            if (user == null || user.Status == UserStatus.Blocked)
            {
                context.Response.StatusCode = 401;
                return;
            }
            user.LastSeenTime = DateTime.UtcNow;
            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();
            await _next(context);
        }
    }
}
