using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core3Angular8.Model;
using Core3Angular8.RSA;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Core3Angular8.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class EncryptionController : ControllerBase
	{

		private RsaHelper rsaHelper;

		// GET: api/<EncryptionController>
		[HttpGet]
		public IEnumerable<string> Get()
		{
			return new string[] { "value1", "value2" };
		}

		// GET api/<EncryptionController>/5
		[HttpGet("{id}")]
		public string Get(int id)
		{
			string value = "Mety le izy";
			return value.ToString();
		}

		//Receive Encrypted password from FRONT :
		// POST api/<EncryptionController>
		[HttpPost()]
		public string Post([FromBody] UserLoginModel user)
		{
			try
			{
				rsaHelper = new RsaHelper();
				var clearTextPassword = rsaHelper.Decrypt(user.Password);
				//return user.UserName.Equals("TechnoSaviour") && clearTextPassword.Equals("TechnoSaviour");

				//Try to return encrypted value to FRONT:
				var encryptedValue = rsaHelper.Encrypt("True");
				return encryptedValue.ToString();
			}
			catch (Exception)
			{
				// Log ex 
				return "false";
			}
		}

		// PUT api/<EncryptionController>/5
		[HttpPut("{id}")]
		public string Put(int id, [FromBody] string value)
		{
			string result = "Metu le fuck....";
			return result.ToString();
		}

		// DELETE api/<EncryptionController>/5
		[HttpDelete("{id}")]
		public void Delete(int id)
		{
		}
	}
}
