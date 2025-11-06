'use client';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { doc, setDoc, getDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Logo from '@/components/ui/logo';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useFirestore } from '@/firebase';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

const signupSchema = z.object({
    displayName: z.string().min(2, { message: 'Display name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export default function AuthPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = React.useState<User | null>(null);
  const [isSignUp, setIsSignUp] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        router.push('/');
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [auth, router]);
  
  const form = useForm({
    resolver: zodResolver(isSignUp ? signupSchema : loginSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
    },
  });

  const handleFormSubmit = async (values: any) => {
    if (isSignUp) {
      await handleEmailSignUp(values);
    } else {
      await handleEmailLogin(values);
    }
  };

  const handleEmailLogin = async (values: z.infer<typeof loginSchema>) => {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({ title: 'Login Successful', description: 'Welcome back!' });
      router.push('/');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Login Failed', description: error.message });
    }
  };

  const handleEmailSignUp = async (values: z.infer<typeof signupSchema>) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const user = userCredential.user;
        await updateProfile(user, {
            displayName: values.displayName
        });

        // Create user profile in Firestore
        await setDoc(doc(firestore, "users", user.uid), {
            displayName: values.displayName,
            email: user.email,
            photoURL: user.photoURL,
            role: 'user' // Default role
        });
        
        toast({ title: 'Sign Up Successful', description: 'Welcome to CineVerse!' });
        router.push('/');
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Sign Up Failed', description: error.message });
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // New user, create profile with default role
        await setDoc(userDocRef, {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            role: 'user' // Default role
        });
      } else {
        // Existing user, update profile but preserve role
        await setDoc(userDocRef, {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL
        }, { merge: true });
      }

      toast({ title: 'Login Successful', description: 'Welcome back!' });
      router.push('/');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Login Failed', description: error.message });
    }
  };


  const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
      <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.2 76.2c-27.7-26.1-66.9-42.3-111.7-42.3-90.2 0-163.4 73.2-163.4 163.4s73.2 163.4 163.4 163.4c74.1 0 134.4-49.4 152.1-115.1H248v-96.2h239.9c4.9 26.3 7.9 54.1 7.9 82.9z"></path>
    </svg>
  );

  if (user) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
      <Card className="w-full max-w-sm mx-auto shadow-2xl shadow-primary/10 border-white/10 bg-card/80 backdrop-blur-lg">
        <CardHeader className="text-center">
            <Logo className='justify-center mb-2'/>
          <CardTitle className="text-2xl font-headline">{isSignUp ? 'Create an Account' : 'Welcome Back'}</CardTitle>
          <CardDescription>
            {isSignUp ? 'Join CineVerse today!' : 'Sign in to continue your journey on CineVerse'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="grid gap-4">
               {isSignUp && (
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="m@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <div className="flex items-center">
                      <FormLabel>Password</FormLabel>
                      {!isSignUp && (
                          <button
                            type="button"
                            onClick={() => alert('Password reset not implemented yet.')}
                            className="ml-auto inline-block text-sm underline"
                          >
                            Forgot your password?
                          </button>
                      )}
                    </div>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/80">
                {isSignUp ? 'Sign Up' : 'Login'}
              </Button>
            </form>
          </Form>
          <Button variant="outline" className="w-full mt-4" onClick={handleGoogleLogin}>
            <GoogleIcon />
            {isSignUp ? 'Sign Up with Google' : 'Login with Google'}
          </Button>
          <div className="mt-4 text-center text-sm">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={() => { setIsSignUp(!isSignUp); form.reset(); }} className="underline">
              {isSignUp ? 'Login' : 'Sign up'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
