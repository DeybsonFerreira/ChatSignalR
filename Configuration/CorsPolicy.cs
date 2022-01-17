using Microsoft.Extensions.DependencyInjection;

namespace Configuration
{
    public static class CorsPolicy
    {
        public static IServiceCollection AllowAnyCorsPolicy(this IServiceCollection services)
        {
            services.AddCors(option =>
            {
                option.AddPolicy("AllowAnyCorsPolicy", builder => builder
                .SetIsOriginAllowed(x => _ = true)
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials()
                );
            });
            return services;
        }
    }
}