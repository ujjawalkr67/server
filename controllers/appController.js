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
export async function register(req,res){

    try {
        const { username, password, profile, email } = req.body;        

        // check the existing user
        const existUsername = new Promise((resolve, reject) => {
            console.log("hl")
            UserModel.findOne({ username }, function(err, user){
                if(err) reject(new Error(err))
                if(user) reject({ error : "Please use unique username"});

                resolve();
            })
        });

        // check for existing email
        const existEmail = new Promise((resolve, reject) => {
            UserModel.findOne({ email }, function(err, email){
                if(err) reject(new Error(err))
                if(email) reject({ error : "Please use unique Email"});

                resolve();
            })
        });


        Promise.all([existUsername, existEmail])
            .then(() => {
                if(password){
                    bcrypt.hash(password, 10)
                        .then( hashedPassword => {
                            
                            const user = new UserModel({
                                username,
                                password: hashedPassword,
                                profile: profile || '',
                                email
                            });

                            // return save result as a response
                            user.save()
                                .then(result => res.status(201).send({ msg: "User Register Successfully"}))
                                .catch(error => res.status(500).send({error}))

                        }).catch(error => {
                            return res.status(500).send({
                                error : "Enable to hashed password"
                            })
                        })
                }
            }).catch(error => {
                return res.status(500).send({ error })
            })


    } catch (error) {
        return res.status(500).send(error);
    }

}

// export async function register(req, res) {
//     try {
//       const { username, password, profile, email } = req.body;
  
//       // Check the existing user
//       const existUsername = await new Promise((resolve, reject) => {
//         UserModel.findOne({ username }, function (err, user) {
//           if (err) reject(new Error(err));
//           if (user) reject({ error: "Please use a unique username" });
  
//           // resolve();
//         });
//       });
  
//       // Check for existing email
//       const existEmail = await new Promise((resolve, reject) => {
//         UserModel.findOne({ email }, function (err, email) {
//           if (err) reject(new Error(err));
//           if (email) reject({ error: "Please use a unique email" });
  
//           // resolve();
//         });
//       });
  
//       if (password) {
//         const hashedPassword = await bcrypt.hash(password, 10);
  
//         const user = new UserModel({
//           username,
//           password: hashedPassword,
//           profile: profile || "",
//           email,
//         });
  
//         const result = await user.save();
  
//         return res.status(201).send({ msg: "User registered successfully" });
//       }
//     } catch (error) {
//       return res.status(500).send(error);
//     }
// }
  







