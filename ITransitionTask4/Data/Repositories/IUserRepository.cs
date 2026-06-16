namespace ITransitionTask4.Data.Repositories
{
    public interface IUserRepository
    {
        IQueryable<User> GetAll(params Expression<Func<User, object>>[] includes);

        Task AddAsync(User user);

        void Update(User user);

        void UpdateRange(List<User> users);

        void DeleteRange(List<User> users);

        Task SaveChangesAsync();
    }
}
