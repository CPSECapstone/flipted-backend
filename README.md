# flipted-backend

<p>Clone the repo and:</p>
<ul>
 
<li><code>npm install -g serverless</code></li>
<li><code>npm install</code></li>
</ul>
<br>
<p>Next, type in <code>serverless offline</code> and visit the url it generates on your local machine</p>
<br>
<p>Now you can start to play around with the <strong>resolvers, typedefs, and queries</strong> that our Apollo Server is working with (I use Postman to test queries).</p>

<h5>Resolvers</h5>
<p>These will be the keywords that are waiting to be triggered. Our only resolver right now is for users.</p>
 
<h5>Typedefs</h5>
<p>Typedefs will define both Queries and the contents of any objects we return. This is where Graphql gets pretty powerful.</p>

<h5>Queries</h5>
<p>In the same constant, we define all of the Queries our Graphql server will handle and what it returns.</p>

<h5>Deployment</h5>
<p>When you're ready, you can deploy or redeploy with <code>serverless deploy</code>. To specify the stage (dev/prod), use the following <code>serverless deploy --stage prod</code> or <code>serverless deploy --stage dev</code></p>.
