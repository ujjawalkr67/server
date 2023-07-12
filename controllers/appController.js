import UserModel from '../model/User.model.js'
import bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken';
import ENV from '../config.js'


/** middleware for verify user */
export async function verifyUser(req, res, next){
  try {
      
      const { username } = req.method == "GET" ? req.query : req.body;

      // check the user existance
      let exist = await UserModel.findOne({ username });
      if(!exist) return res.status(404).send({ error : "Can't find User!"});
      next();

  } catch (error) {
      return res.status(404).send({ error: "Authentication Error"});
  }
}

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
export  async function register (req, res) {
  // console.log("hl")
    try {
      const { username, password, profile, email } = req.body;
      // console.log(req.body)

      // Check if the user already exist
      const existUsername = await UserModel.findOne({ username })
      // console.log(existUsername)
      if(existUsername) return res.status(400).send({ error: "Please use a unique username" });

      // Check if the email already exist
      const existEmail = await UserModel.findOne({ email })
      // console.log(existEmail)
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
          // user: user
          
          });
      }
    } catch (error) {
      return res.status(400).send(error);
    }
}



/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
export async function login(req,res){
   
  const { username, password } = req.body;
  console.log(req.body.username)

  try {
      console.log(req.body.username)
      UserModel.findOne({ username })
          .then(user => {
              bcrypt.compare(password, user.password)
                  .then(passwordCheck => {

                      if(!passwordCheck) return res.status(400).send({ error: "Don't have Password"});

                      // create jwt token
                      const token = jwt.sign({
                                      userId: user._id,
                                      username : user.username
                                  }, ENV.JWT_SECRET , { expiresIn : "24h"});

                      return res.status(200).send({
                          msg: "Login Successful...!",
                          username: user.username,
                          token
                      });                                    

                  })
                  .catch(error =>{
                      return res.status(400).send({ error: "Password does not Match"})
                  })
          })
          .catch( error => {
              return res.status(404).send({ error : "Username not Found"});
          })

  } catch (error) {
    console.log(req.body.username)

      return res.status(500).send({ error});
  }
}



/** GET: http://localhost:8080/api/user/example123 */
export async function getUser(req,res){
    
  const { username } = req.params;

  try {
      
      if(!username) return res.status(501).send({ error: "Invalid Username"});

      UserModel.findOne({ username }, function(err, user){
          if(err) return res.status(500).send({ err });
          if(!user) return res.status(501).send({ error : "Couldn't Find the User"});

          /** remove password from user */
          // mongoose return unnecessary data with object so convert it into json
          const { password, ...rest } = Object.assign({}, user.toJSON());

          return res.status(201).send(rest);
      })

  } catch (error) {
      return res.status(404).send({ error : "Cannot Find User Data"});
  }

}