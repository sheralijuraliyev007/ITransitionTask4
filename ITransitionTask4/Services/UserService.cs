
using Mapster;

namespace ITransitionTask4.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<string> BlockAsync(List<Guid> userIds)
        {
            var users = await _userRepository.GetAll().Where(u => userIds.Contains(u.Id)).ToListAsync();

            foreach (var user in users) {
                user.PreviousStatus = user.Status;
                user.Status = UserStatus.Blocked;
            }
            _userRepository.UpdateRange(users);
            await _userRepository.SaveChangesAsync();

            return "Users blocked successfully";
        }

        public async Task<string> DeleteAsync(List<Guid> userIds)
        {
            var users = await _userRepository.GetAll().Where(u=>userIds.Contains(u.Id)).ToListAsync();

            _userRepository.DeleteRange(users);

            await _userRepository.SaveChangesAsync();

            return "Deleted sucessfully";
        }

        public async Task<string> DeleteUnverifiedAsync(List<Guid> userIds)
        {
            var users = await _userRepository.GetAll().Where(u=> userIds.Contains(u.Id) && u.Status == UserStatus.Unverified).ToListAsync();

            _userRepository.DeleteRange(users);
            await _userRepository.SaveChangesAsync();

            return "Deleted sucessfully";
        }


        
        public async Task<List<UserDto>> GetAllAsync()
        {
            var users = await _userRepository.GetAll().OrderByDescending(u=>u.LastSeenTime).ToListAsync();
            

            var userDtos =  users.Select(u=> u.Adapt<UserDto>()).ToList();
            
            return userDtos;

        }

        public async Task<string> UnblockAsync(List<Guid> userIds)
        {
            var users = await _userRepository.GetAll().Where(u => userIds.Contains(u.Id) && u.Status == UserStatus.Blocked).ToListAsync();

            foreach(var user in users)
            {
                user.Status = user.PreviousStatus ?? UserStatus.Unverified;
                user.PreviousStatus = null; ;
            
            }

            _userRepository.UpdateRange(users);

            await _userRepository.SaveChangesAsync();

            return "Unblocked sucessfully";
        }
    }
}
