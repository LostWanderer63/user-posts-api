# user-posts-api

Express + Sequelize + MySQL example of a **One-to-Many association**: one user has many posts, and each post belongs to one user.

## Association

Defined in [`models/index.js`](models/index.js):

```js
User.hasMany(Post, { foreignKey: { name: 'userId', allowNull: false }, as: 'posts', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: { name: 'userId', allowNull: false }, as: 'user' });
```

`sequelize.sync()` creates the `users` and `posts` tables, with `posts.userId` as a foreign key to `users.id`.

## Setup

1. Create the database in MySQL: `CREATE DATABASE user_posts_db;`
2. Copy `.env.example` to `.env` and fill in your MySQL credentials.
3. `npm install`
4. `npm start` (server runs on http://localhost:3002)

## Endpoints

| Method | Path | What it does |
|---|---|---|
| POST | `/users` | Create a user, optionally with `posts: [{ title, content }]` |
| GET | `/users` | All users with their posts |
| GET | `/users/:id` | One user with their posts |
| POST | `/users/:id/posts` | Create a post for an existing user (`user.createPost()`) |
| GET | `/users/:id/posts` | Posts of one user (`user.getPosts()`) |
| GET | `/posts` | All posts with their author (`include: 'user'`) |

## Example

```bash
curl -X POST http://localhost:3002/users -H 'Content-Type: application/json' \
  -d '{"name":"Asha Rao","email":"asha@example.com","posts":[{"title":"Hello","content":"First post"}]}'

curl -X POST http://localhost:3002/users/1/posts -H 'Content-Type: application/json' \
  -d '{"title":"Another post","content":"Second post"}'

curl http://localhost:3002/users/1
```
