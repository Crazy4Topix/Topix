import React, { useContext } from 'react';
import { Pressable, TextInput, View, Text, SafeAreaView } from 'react-native';
import { SupabaseUserSession } from '../contexts/user_session';
import { Formik } from 'formik';
import * as yup from 'yup';
import { signInWithEmail } from '../lib/supabase';

export default function Login() {
  const { setSession } = useContext(SupabaseUserSession);

  const validationSchema = yup.object({
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup.string().required('Password is required'),
  });
  const submitForm = async (values: { email: string; password: string }, { setErrors }: any) => {
    const data = await signInWithEmail(values.email, values.password);

    if (data?.error != null) {
      setSession(null);
      setErrors({ password: data.error.message });
      return;
    }

    if (data?.data != null) {
      setSession(data.data.session);
    }
  };

  return (
    <SafeAreaView className={'mx-5 h-full pt-12'}>
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={submitForm}
        validationSchema={validationSchema}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View className={'bg-background flex'}>
            <Text className={'text-primary-text text-lg'}>Email</Text>
            <TextInput
              className={
                'border-primary font-primary-cond text-primary-text w-full rounded-lg border-2 bg-white px-3 py-2 text-base'
              }
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              placeholder={'alexander@pom.show'}
              placeholderTextColor="gray"
              autoComplete={'email'}
              keyboardType={'email-address'}
            />
            <View className={'flex shrink'}>
              <Text className={'text-lg text-red-600'}>
                {errors.email != null && touched.email === true && errors.email}
              </Text>
            </View>

            <Text className={'font-primary-cond-bold  text-primary-text text-lg'}>Password</Text>
            <TextInput
              className={
                'border-primary font-primary-cond w-full rounded-lg border-2 bg-white px-3 py-2 text-base text-black'
              }
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              secureTextEntry={true}
              placeholder={'Al3xand3r!'}
              textContentType={'password'}
              placeholderTextColor="gray"
            />
            <View className={'flex shrink'}>
              <Text className={'text-lg text-red-600'}>
                {errors.password != null && touched.password === true && errors.password}
              </Text>
            </View>

            <Pressable
              onPress={() => {
                handleSubmit();
                console.log('Click');
              }}
              className={'bg-accent flex h-16 w-32 justify-center rounded-md'}
            >
              <Text className={'self-center text-white'}>Submit</Text>
            </Pressable>
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
}
