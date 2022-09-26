using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Core3Angular8
{
	public class RepeatingService : BackgroundService
	{
		private ILogger<RepeatingService> _logger;

		//Timer logger/////////
		public RepeatingService(ILogger<RepeatingService> logger)
		{
			_logger = logger;
		}

		/// PeriodicTimer introduced in net 6////////
		//private readonly PeriodicTimer _timer = new PeriodicTimer(TimeSpan.FromMilliseconds(1000));

		protected override async Task ExecuteAsync(CancellationToken stoppingToken)
		{
			
			//Timer
			while (!stoppingToken.IsCancellationRequested)
			{
				_logger.LogInformation("Some infos");
				Console.WriteLine(DateTime.Now.ToString());
				await Task.Delay(1000, stoppingToken);
			}

			//PeriodicTimer

			
		}

		private static async Task DoWorkAsynk()
		{
			Console.WriteLine(DateTime.Now.ToString());
			await Task.Delay(500);
		}
	}
}
