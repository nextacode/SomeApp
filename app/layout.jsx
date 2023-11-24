import {ClerkProvider} from '@clerk/nextjs'
import {GeistMono} from 'geist/font/mono'

import './globals.css'

export const metadata = {
	title: 'SomeApp',
	description: ''
}

// export const preferredRegion = 'iad1'

export default function RootLayout ({children}) {
	return <ClerkProvider>
		<html lang='en'>
			<body className={GeistMono.className}>
				{children}
			</body>
		</html>
	</ClerkProvider>
}