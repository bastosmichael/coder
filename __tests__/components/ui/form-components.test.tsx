import React from 'react';
import { render } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormField
} from '../../../components/ui/form';

describe('Form components', () => {
  it('useFormField throws outside of FormField', () => {
    const Thrower = () => {
      useFormField();
      return null;
    };
    const Wrapper = () => {
      const methods = useForm();
      return (
        <Form {...methods}>
          <Thrower />
        </Form>
      );
    };
    expect(() => render(<Wrapper />)).toThrow(
      'useFormField should be used within <FormField>'
    );
  });

  it('links label and control and shows error message', () => {
    const TestForm = () => {
      const methods = useForm({ defaultValues: { name: '' } });
      React.useEffect(() => {
        methods.setError('name', { message: 'Required' });
      }, [methods]);
      return (
        <Form {...methods}>
          <FormField
            control={methods.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <input data-testid="input" {...field} />
                </FormControl>
                <FormDescription>Description</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
      );
    };
    const { getByText, getByTestId } = render(<TestForm />);
    const input = getByTestId('input');
    const label = getByText('Label');
    expect((label as HTMLLabelElement).htmlFor).toBe(input.id);
    expect(getByText('Description')).toBeInTheDocument();
    expect(getByText('Required')).toBeInTheDocument();
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });
});
