import React, { type FunctionComponent, useContext } from 'react';
import { Pressable, SafeAreaView, Text, TextInput, View } from 'react-native';
import * as yup from 'yup';
import { supabase } from '../lib/supabase';
import { Formik } from 'formik';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useNavigation } from 'expo-router';
import { SupabaseUserSession } from '../contexts/user_session';

const userInformation: FunctionComponent = () => {
  const { session, user } = useContext(SupabaseUserSession);

  const navigation = useNavigation();

  const validationSchema = yup.object({
    name: yup.string().required('naam is verplicht'),
    birthday: yup
      .date()
      .required('Geboortedatum is verplicht')
      .max(new Date(), 'Mag niet in de toekomst liggen')
      .test('is-at-least-13', 'Moet minimaal 13 jaar oud zijn.', function (value) {
        const today = new Date();
        const minimumAgeDate = new Date(
          today.getFullYear() - 13,
          today.getMonth(),
          today.getDate()
        );

        return value != null && value <= minimumAgeDate;
      }),
  });

  const submitForm = async (values: { name: string; birthday: Date }) => {
    const { error, status } = await supabase
      .from('profiles')
      .upsert({
        id: user?.id,
        full_name: values.name,
        birthdate: values.birthday,
      })
      .select();

    if (error !== null) {
      console.error('Error creating profile', error, user, session);
      return;
    }

    // @ts-expect-error It complains about never but it is there
    navigation.navigate('topicSelection');
  };

  return (
    <SafeAreaView className={'h-full w-full bg-white px-5 pt-12'}>
      <Formik
        initialValues={{ name: '', birthday: new Date() }}
        onSubmit={submitForm}
        validationSchema={validationSchema}
      >
        {({ handleChange, setFieldValue, handleBlur, handleSubmit, values, errors, touched }) => (
          <View className={'flex'}>
            <Text className={'font-primary text-lg text-primary-text'}>Volledige naam</Text>
            <TextInput
              className={
                'w-full rounded-lg border-2 border-primary bg-white px-3 py-2 font-primary text-base text-primary-text'
              }
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              placeholder={'Alexander'}
              placeholderTextColor="gray"
              autoComplete={'name'}
            />
            <View className={'flex shrink'}>
              <Text className={'font-primary text-lg text-red-600'}>
                {errors.name != null && touched.name === true && errors.name}
              </Text>
            </View>

            <Text className={'font-primary text-lg text-primary-text'}>Geboortedatum</Text>
            <Pressable
              onPress={() => {
                // setShowDatePicker(true);
                DateTimePickerAndroid.open({
                  value: values.birthday,
                  onChange: (event, date) => {
                    if (date != null && event.type !== 'dismissed') {
                      setFieldValue('birthday', date).catch((err: any) => {
                        console.error(err);
                      });
                    }
                  },
                });
              }}
            >
              <TextInput
                className={
                  'w-full rounded-lg border-2 border-primary bg-white px-3 py-2 font-primary text-base text-primary-text'
                }
                value={values.birthday.toLocaleDateString('nl-NL')}
                editable={false}
              />
            </Pressable>
            <View className={'flex shrink'}>
              <Text className={'font-primary text-lg text-red-600'}>
                {errors.birthday != null && touched.birthday && String(errors.birthday)}
              </Text>
            </View>

            <Pressable
              onPress={() => {
                handleSubmit();
              }}
              className={'flex h-16 w-32 justify-center rounded-md bg-accent'}
            >
              <Text className={'self-center font-primary_bold text-white'}>Volgende</Text>
            </Pressable>
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default userInformation;
