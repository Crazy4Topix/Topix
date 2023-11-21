import React, { useContext } from 'react';
import { Pressable, TextInput, View, Text, SafeAreaView, Image } from 'react-native';
import { SupabaseUserSession } from '../contexts/user_session';
import { Formik } from 'formik';
import * as yup from 'yup';
import { signInWithEmail } from '../lib/supabase';
import { useNavigation } from 'expo-router';

export default function Login() {
  const { setSession } = useContext(SupabaseUserSession);
  const navigation = useNavigation();

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
      // @ts-expect-error It complains about never but it is there
      navigation.navigate('(app)');
    }
  };

  return (
    <SafeAreaView className={'mx-5 h-full pt-12'}>
      <View className={'my-12 flex w-full justify-center'}>
        <Image
          source={require('../assets/images/Topix_wit.png')}
          className={' h-24 w-8/12 self-center'}
        />
      </View>
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={submitForm}
        validationSchema={validationSchema}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View className={'flex bg-background'}>
            <Text className={'text-lg text-primary-text'}>Email</Text>
            <TextInput
              className={
                'font-primary-cond w-full rounded-lg border-2 border-primary bg-white px-3 py-2 text-base text-primary-text'
              }
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              autoCapitalize='none'
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

            <Text className={'font-primary-cond-bold  text-lg text-primary-text'}>Password</Text>
            <TextInput
              className={
                'font-primary-cond w-full rounded-lg border-2 border-primary bg-white px-3 py-2 text-base text-black'
              }
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              autoCapitalize='none'
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
              }}
              className={'flex h-16 w-32 justify-center rounded-md bg-accent'}
            >
              <Text className={'self-center text-white'}>Login</Text>
            </Pressable>
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
}
