using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Core3Angular8.Model;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Core3Angular8.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class StudentsController : ControllerBase
	{
		// GET: api/<StudentsController>
		[HttpGet]
		public IEnumerable<Student> Get()
		{
			//MON CODE	:
			List<Student> oStudents = new List<Student>()
			{ 
				new Student(){Id = 0, Name="Scrapy", Roll=1001},
				new Student(){Id = 1, Name="Coco", Roll=15871},
				new Student(){Id = 2, Name="Toky be", Roll=2510}
			};

			//return new string[] { "value1", "value2" };
			return oStudents;
		}



		// GET api/<StudentsController>/5
		[HttpGet("{id}")]
		public string Get(int id)
		{
			string value = "Met ve le le";
			return value.ToString();
		}

		// POST api/<StudentsController>
		[HttpPost]
		public string Post([FromBody] PostModelData value)
		{
			string retour = "success";
			return retour.ToString();//il faut imperativement convertir  la valeur en toString
		}

		// PUT api/<StudentsController>/5
		[HttpPut("{id}")]
		public void Put(int id, [FromBody] PutModelData value)
		{
			string res = "sdfsdfsdf" + value.value1.ToString();
		}

		// DELETE api/<StudentsController>/5
		[HttpDelete("{id}")]
		public void Delete(int id)
		{
		}

		public class PostModelData
		{
			public string value1 { get; set; }
			public string value2 { get; set; }
		}

		public class PutModelData
		{
			public string value1 { get; set; }
			public string value2 { get; set; }
		}
	}
}
