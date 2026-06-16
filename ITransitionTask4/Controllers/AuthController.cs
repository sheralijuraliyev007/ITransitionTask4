using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ITransitionTask4.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }



        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] CreateUserModel model)
        {
            var (success, message) = await _authService.RegisterAsync(model);
            return success ? Ok(message) : BadRequest(message);
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginUserModel model)
        {
            var (success, message) = await _authService.LoginAsync(model);
            return success ? Ok(message) : BadRequest(message);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> VerifyEmail([FromQuery] Guid token)
        {
            var result = await _authService.VerifyEmail(token);
            return Ok(result);
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordModel forgotPasswordModel)
        {
            var result = await _authService.ForgotPasswordAsync(forgotPasswordModel.Email);
            return Ok(result);
        }
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordModel model)
        {
            var result = await _authService.ResetPasswordAsync(model.Token, model.NewPassword);
            return Ok(result);
        }
    }
}
