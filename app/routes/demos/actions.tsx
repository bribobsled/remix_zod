import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import {z} from "zod";

// export const meta: MetaFunction = () => ({
//   title: "Actions Demo",
// });


// When your form sends a POST, the action is called on the server.
// - https://remix.run/api/conventions#action
// - https://remix.run/guides/data-updates
export const action: ActionFunction = async ({ request }) => {
  const formPayload = Object.fromEntries(await request.formData());

  const UserSchema = z.object({
  first: z.string().min(1, {message: "First name is required"}),
  last: z.string().min(1, {message: "Last name is required"}),
  birthdate: z.string().min(1, {message: "Birthdate is required"}),
  email: z.string().email({message: "Invalid email address"})
});
// Q: how to handle date type if output is string? 
 

try{
  const validatedUser = UserSchema.parse(formPayload);
  console.log("Form is validated");
} catch(error){
  if(error instanceof z.ZodError){
    let issues= error.issues;
    let errorObject = {}; 
    issues.forEach(item => {
      errorObject[item.path[0]] = item.message;
      //Q: how do I handle this error? 
    })

    return {formPayload, errorObject};
  }
}


  // Typical action workflows start with validating the form data that just came
  // over the network. Clientside validation is fine, but you definitely need it
  // server side.  If there's a problem, return the data and the component can
  // render it.
  // if (!answer || typeof answer !== "string") {
  //   return json("Come on, at least try!", { status: 400 });
  // }

  // if (answer !== "egg") {
  //   return json(`Sorry, ${answer} is not right.`, { status: 400 });
  // }

  // Finally, if the data is valid, you'll typically write to a database or send or
  // email or log the user in, etc. It's recommended to redirect after a
  // successful action, even if it's to the same place so that non-JavaScript workflows
  // from the browser doesn't repost the data if the user clicks back.
  return redirect("/demos/correct");
};

export default function ActionsDemo() {
  // https://remix.run/api/remix#useactiondata
  const actionData = useActionData();
  console.log(actionData)



  // This form works without JavaScript, but when we have JavaScript we can make
  // the experience better by selecting the input on wrong answers! Go ahead, disable
  // JavaScript in your browser and see what happens.
 

  return (
    <div className="remix__page">
      <main>
        <h2>Actions!</h2>
        <p>
          This form submission will send a post request that we handle in our
          `action` export. Any route can export an action to handle data
          mutations.
        </p>
        <Form method="post" className="remix__form">
          <h3>Post an Action</h3>
          <p>
            <i>First Name</i>
          </p>
          <label>
            <input name="first" type="text" />
            <span style={{color:'red'}}>
              {actionData?.errorObject?.first}
            </span>
          </label>
          <p>
            <i>Last Name</i>
          </p>
          <label>
            <input name="last" type="text" />
            <span style={{color:'red'}}>
               {actionData?.errorObject?.last}
            </span>
          </label>
          <p>
            <i>Birthdate</i>
          </p>
          <label>
            <input name="birthdate" type="date" />
            <span style={{color:'red'}}>
               {actionData?.errorObject?.birthdate}
            </span>
          </label>
          <p>
            <i>Email</i>
          </p>

          <label>
            <input name="email" type="text" />
            <span style={{color:'red'}}>
               {actionData?.errorObject?.email}
            </span>
          </label>
          <div>
            <button>Submit!</button>
          </div>

        </Form>
      </main>

      <aside>
        <h3>Additional Resources</h3>
        <ul>
          <li>
            Guide:{" "}
            <a href="https://remix.run/guides/data-writes">Data Writes</a>
          </li>
          <li>
            API:{" "}
            <a href="https://remix.run/api/conventions#action">
              Route Action Export
            </a>
          </li>
          <li>
            API:{" "}
            <a href="https://remix.run/api/remix#useactiondata">
              <code>useActionData</code>
            </a>
          </li>
        </ul>
      </aside>
    </div>
  );
}
