using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PessoasAPI.Models;
using PessoasAPI.Contexto;
using Microsoft.EntityFrameworkCore;
using Microsoft.OData.Edm;
using Microsoft.AspNet.OData.Builder;
using Microsoft.AspNet.OData.Extensions;
using Microsoft.AspNet.OData.Batch;
using Microsoft.AspNetCore.Cors.Infrastructure;

namespace PessoasAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();
            services.AddOData();
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            var connection = @"data source=(local);initial catalog=northwind;uid=sa;password=151820;";
            services.AddDbContext<PessoaDbContext>
            (options => options.UseSqlServer(connection));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            app.UseDefaultFiles();
            app.UseStaticFiles();
            //app.UseHttpsRedirection();
            app.UseODataBatching();
            app.UseMvc(
                b=>{
                    b.Count().Filter().OrderBy().Expand().Select().MaxTop(null);
                    b.MapODataServiceRoute("odata","service.svc",GetEdmModel(),new DefaultODataBatchHandler());
                    b.EnableDependencyInjection();
                }
            );

            app.UseCors(
                options=>options.WithOrigins("*").AllowAnyMethod().AllowAnyHeader().AllowAnyOrigin()
            );
        }

        private static IEdmModel GetEdmModel()
        {
            ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
            builder.EntitySet<Pessoa>("Pessoas");
            return builder.GetEdmModel();
        }
    }
}
