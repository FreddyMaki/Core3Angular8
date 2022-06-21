using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Core3Angular8.Controllers
{
	public class AESEncrytDecry
	{
			

		private static string DecryptStringFromBytes(byte[] cipherText, byte[] key, byte[] iv)
		{
			// Check arguments.
			if (cipherText == null || cipherText.Length <= 0)
			{
				throw new ArgumentNullException("cipherText");
			}
			if (key == null || key.Length <= 0)
			{
				throw new ArgumentNullException("key");
			}
			if (iv == null || iv.Length <= 0)
			{
				throw new ArgumentNullException("key");
			}
			// Declare the string used to hold
			// the decrypted text.
			string plaintext = null;
			// Create an RijndaelManaged object
			// with the specified key and IV.
			using (RijndaelManaged rijAlg = new RijndaelManaged())
			{
				//Settings
				rijAlg.Mode = CipherMode.CBC;
				rijAlg.Padding = PaddingMode.PKCS7;
				rijAlg.FeedbackSize = 128;
				rijAlg.Key = key;
				rijAlg.IV = iv;
				// Create a decrytor to perform the stream transform.
				var decryptor = rijAlg.CreateDecryptor(rijAlg.Key, rijAlg.IV);
				try
				{
					// Create the streams used for decryption.
					using (var msDecrypt = new MemoryStream(cipherText))
					{
						using (var csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
						{
							using (var srDecrypt = new StreamReader(csDecrypt))
							{
								// Read the decrypted bytes from the decrypting stream
								// and place them in a string.
								plaintext = srDecrypt.ReadToEnd();
							}
						}
					}
				}
				catch
				{
					plaintext = "keyError";
				}

			}
			return plaintext;
		}
		public static byte[] EncryptStringToBytes(string plainText, byte[] key, byte[] iv)
		{
			// Check arguments.
			if (plainText == null || plainText.Length <= 0)
			{
				throw new ArgumentNullException("plainText");
			}
			if (key == null || key.Length <= 0)
			{
				throw new ArgumentNullException("key");
			}
			if (iv == null || iv.Length <= 0)
			{
				throw new ArgumentNullException("key");
			}
			byte[] encrypted;

			// Create a RijndaelManaged object
			// with the specified key and IV.
			using (RijndaelManaged rijAlg = new RijndaelManaged())
			{
				rijAlg.Mode = CipherMode.CBC;
				rijAlg.Padding = PaddingMode.PKCS7;
				rijAlg.FeedbackSize = 128;

				rijAlg.Key = key;
				rijAlg.IV = iv;
				
				// Create a encrytor to perform the stream transform.
				var encryptor = rijAlg.CreateEncryptor(rijAlg.Key, rijAlg.IV);
				
				// Create the streams used for encryption.
				using (var msEncrypt = new MemoryStream())
				{
					using (var csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
					{
						using (var swEncrypt = new StreamWriter(csEncrypt))
						{
							//Write all data to the stream.
							swEncrypt.Write(plainText);
						}
						encrypted = msEncrypt.ToArray();
					}
				}
			}
			// Return the encrypted bytes from the memory stream.
			return encrypted;

		}

		public static string DecryptStringAES(string cipherText, string key, string iv)
		{
			//TODO encrypt these keys with RSA algorithm in Front
			//var keybytes = Encoding.UTF8.GetBytes("8080808080808080");
			//var iv = Encoding.UTF8.GetBytes("8080808080808080");

			//TODO Encode key and IV string to UTF-8:
			

			var keybytes = Encoding.UTF8.GetBytes(key);
			var ivbytes = Encoding.UTF8.GetBytes(iv);

			var encrypted = Convert.FromBase64String(cipherText);
			var decriptedFromJavascript = DecryptStringFromBytes(encrypted, keybytes, ivbytes);
			return decriptedFromJavascript;
		}

	}

}
