import UserModel from '../model/User.model.js'
import bcrypt from 'bcryptjs';

/** POST: http://localhost:8080/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
*/
export default async function register (req, res) {
  console.log("hl")
    try {
      const { username, password, profile, email } = req.body;
      console.log(req.body)

      // Check if the user already exist
      const existUsername = await UserModel.findOne({ username })
      console.log(existUsername)
      if(existUsername) return res.status(400).send({ error: "Please use a unique username" });

      // Check if the email already exist
      const existEmail = await UserModel.findOne({ email })
      console.log(existEmail)
      if(existEmail) return res.status(400).send({ error: "Please use a unique email" });

      // Hash the password
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new UserModel({
          username,
          password: hashedPassword,
          profile: profile || "",
          email,
        });
        
        // Save the user
        await user.save();
        
        return res.status(201).send({
          msg: "User registered successfully",
          user: user
          
          });
      }
    } catch (error) {
      return res.status(400).send(error);
    }
  }
