using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace PeriodicTimerExample
{
	public class RepeatingService : BackgroundService , IDisposable
	{
		private ILogger<RepeatingService> _logger;

		public RepeatingService(ILogger<RepeatingService> logger)
		{
			_logger = logger;
		}

		protected override async Task ExecuteAsync(CancellationToken stoppingToken)
		{
			while (!stoppingToken.IsCancellationRequested)
			{
				_logger.LogInformation("Some infos");
				Console.WriteLine(DateTime.Now.ToString("0"));
				await Task.Delay(1000);
			}
			//throw new NotImplementedException();
		}
	}
}
