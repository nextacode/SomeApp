import {UserButton, auth, currentUser} from '@clerk/nextjs'
import Link from 'next/link'
import {sql} from '@vercel/postgres'
import {revalidatePath} from 'next/cache'

const randID = () => Math.floor(Math.random()*999_999+100_000)

export const dynamic = 'force-dynamic'

export default async function Homepage() {
	const {userId} = auth()

	const [
		user,
		{rows}
	] = await Promise.all([
		currentUser(),
		sql`SELECT * FROM posts;`
	])

	async function postSomething(formData) {
		'use server'

		const {userId} = auth()
		if (!userId) return 'error_signed_out'

		const c = formData.get('content')
		if (c.length==0 || c.length>1024) return 'error_content'

		await sql`INSERT INTO posts VALUES (
			${randID()},
			${c},
			${Math.round(Date.now()/1000)},
			${userId}
		);`
		revalidatePath('/')
	}

	async function deletePost(formData) {
		'use server'

		const {userId} = auth()
		if (!userId) return 'error_signed_out'

		const pID = formData.get('postid')

		// TODO make sure the post is owned by the user

		await sql`DELETE FROM posts WHERE id=${pID};`
		revalidatePath('/')
	}

	return <>
		<div className='text-[30px] font-bold mb-5'>
			SomeApp
		</div>

		{rows.map(row => <div key={row.id}>
          	{row.text}

		  	{row.userid==userId && <form action={deletePost}>
				<input type='hidden' value={row.id} name='postid'/>
				<button type='submit' className='text-[purple]'>
					[x]
				</button>
			</form>}
        </div>)}

		{
			userId ? <>
				<form action={postSomething} className='border-2'>
					<input type='text' placeholder='Something nice' name='content'/>

					<button type='submit' className='btn'>
						Post
					</button>
				</form>

				Welcome {user.username}!
				<UserButton afterSignOutUrl='/'/>
			</> : <Link href='/signin' className='btn'>
				Signin to post
			</Link>
		}
	</>
}