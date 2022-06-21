using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using Newtonsoft.Json;
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
		/// <summary>
		/// Here we gonna get all encrypted key, iv, and data from body
		/// key and IV are encrypted with RSA algo and Body is encrypted with AES algo
		/// </summary>
		/// <param name="encryptedKeyWithRSA"></param>
		/// <param name="encryptedIVWithRSA"></param>
		/// <param name="encryptedData"></param>
		/// <returns></returns>
		[HttpPost("postEncryptedData")]
		public string postEncryptedData([FromBody] AllData data)
		{
			try
			{
				//Decrypt key and IV with RSA algo:
				RsaHelper rsaHelper = new RsaHelper();
				string clearTextKey = rsaHelper.Decrypt(data.EncryptedKey);
				string clearTextIV = rsaHelper.Decrypt(data.EncryptedIV);

				//Decrypt data with key and iv using AES algo
				string clearTextData = AESEncrytDecry.DecryptStringAES(data.EncryptedData, clearTextKey, clearTextIV);

				//Now need to convert this clearText to Object model UserLoginModel:
				//Convert JSON String to Object in C#
				string value = "{\"username\":\"aaa\",\"password\":\"aaa\"}";
				UserLoginModel user = JsonConvert.DeserializeObject<UserLoginModel>(clearTextData);


				//Convert JSON Array String to List:
				//Example
				string jsonArray = "[{\"DeptId\": 101,\"DepartmentName\":\"IT\" }, {\"DeptId\": 102,\"DepartmentName\":\"Accounts\" }]";
				var deptList = JsonConvert.DeserializeObject<IList<Department>>(jsonArray);

				foreach (var dept in deptList)
				{
					Console.WriteLine("Department Id is: {0}", dept.DeptId);
					Console.WriteLine("Department Name is: {0}", dept.DepartmentName);
				}




				return "Ok";
			}
			catch (Exception ex)
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

		public class Department
		{
			public int DeptId { get; set; }
			public string DepartmentName { get; set; } 
		}
		
	}
}
