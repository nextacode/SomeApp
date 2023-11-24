import {UserButton, auth, currentUser} from '@clerk/nextjs'
import Link from 'next/link'
import {sql} from '@vercel/postgres'
import {revalidatePath} from 'next/cache'

const randID = () => Math.floor(Math.random()*999_999+100_000)

export const dynamic = 'force-dynamic'

export default async function Homepage() {
	const {userId} = auth()
	const user = await currentUser()

	const {rows} = await sql`SELECT * FROM posts;`

	async function postSomething (formData) {
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
		// TODO maybe refresh
	}

	return <>
		<div className='text-[30px] font-bold mb-5'>
			SomeApp
		</div>

		{rows.map(row => <div key={row.id}>
          	{row.text}
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