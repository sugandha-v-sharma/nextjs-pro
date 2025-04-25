import type { NextPage } from 'next'
import Head from 'next/head'
import EmiCalculator from '@/pages/emiCalculator/index'

const Home: NextPage = () => {
  return (
    <div className="min-h-screen p-6 bg-background">
      <Head>
        <title>EMI Calculator</title>
        <meta name="description" content="Calculate your EMI with our modern calculator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto py-6">
        <h1 className="text-4xl font-bold text-center mb-8">
          EMI Calculator
        </h1>
        <EmiCalculator />
      </main>

      <footer className="mt-8 text-center text-muted-foreground">
        <p>© 2024 EMI Calculator. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Home