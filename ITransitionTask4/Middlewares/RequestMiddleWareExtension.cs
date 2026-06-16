namespace ITransitionTask4.Middlewares
{
    public static class RequestMiddleWareExtension
    {
        public static IApplicationBuilder UseRequest(
            this IApplicationBuilder appBuilder)
        {
            return appBuilder.UseMiddleware<RequestMiddleware>();
        }
    }
}
