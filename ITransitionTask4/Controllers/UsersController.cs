using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace ITransitionTask4.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetAllAsync();
            return Ok(users);
        }

        [HttpPost]
        public async Task<IActionResult> Block([FromBody] List<Guid> userIds)
        {
            var result = await _userService.BlockAsync(userIds);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Unblock([FromBody] List<Guid> userIds)
        {
            var result = await _userService.UnblockAsync(userIds);
            return Ok(result);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete([FromBody] List<Guid> userIds)
        {
            var result = await _userService.DeleteAsync(userIds);
            return Ok(result);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteUnverified([FromBody] List<Guid> userIds)
        {
            var result = await _userService.DeleteUnverifiedAsync(userIds);
            return Ok(result);
        }
    }
}
