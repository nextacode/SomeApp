import {UserButton, auth, currentUser} from '@clerk/nextjs'
import Link from 'next/link'

export default async function Homepage() {
	const {userId} = auth()
	const user = await currentUser()

	return <>
		<div className='text-[30px] font-bold mb-5'>
			SomeApp
		</div>

		{
			userId ? <>
				Welcome {user.username}!

				<UserButton afterSignOutUrl='/'/>
			</> : <Link href='/signin' className='bg-[#9147ff] p-2 rounded text-[20px] font-semibold'>
				Signin
			</Link>
		}
	</>
}