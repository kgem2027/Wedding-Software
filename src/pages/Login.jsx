import GradientText from "../components/ui/gradient-text.jsx"
import AuthenticationBackground from "./pageComponents/AuthenticationBackground.jsx"
import React from 'react'
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from '@/components/animate-ui/components/radix/tabs';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

  const Login = () => {
    return (
      <div>
        <AuthenticationBackground>
          <GradientText
            colors={["#ff6b9d", "#ffffff", "#ff8585"]}
            animationSpeed={4}
          >
            Login
          </GradientText>

          <div className="flex w-full max-w-sm flex-col gap-6">
            <Tabs defaultValue="account">
              <div className="relative">
                <TabsList>
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
              </div>
              <Card className="shadow-none py-0">
                <TabsContents className="py-6">
                  <TabsContent value="account" className="flex flex-col gap-6">
                    <CardHeader>
                      <CardTitle>Account</CardTitle>
                      <CardDescription>
                        Make changes to your account here. Click save when you&apos;re done.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="login-name">Name</Label>
                        <Input id="login-name" placeholder="Your name" />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="login-email">Email</Label>
                        <Input id="login-email" type="email" placeholder="you@example.com" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button>Save changes</Button>
                    </CardFooter>
                  </TabsContent>

                  <TabsContent value="password" className="flex flex-col gap-6">
                    <CardHeader>
                      <CardTitle>Password</CardTitle>
                      <CardDescription>
                        Change your password here. After saving, you&apos;ll be logged out.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="login-current">Current password</Label>
                        <Input id="login-current" type="password" />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="login-new">New password</Label>
                        <Input id="login-new" type="password" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button>Save password</Button>
                    </CardFooter>
                  </TabsContent>
                </TabsContents>
              </Card>
            </Tabs>
          </div>

        </AuthenticationBackground>
      </div>
    )
  }

export default Login