namespace ITransitionTask4.Services.Interfaces
{
    public interface IUserService
    {
        Task<List<UserDto>> GetAllAsync();

        Task<string> BlockAsync(List<Guid> userIds);

        Task<string> UnblockAsync(List<Guid> userIds);

        Task<string> DeleteAsync(List<Guid> userIds);

        Task<string> DeleteUnverifiedAsync(List<Guid> userIds);

    }
}
