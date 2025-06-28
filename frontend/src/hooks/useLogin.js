import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login } from '../lib/api.js'; // Adjust the import path as necessary

const useLogin = () => {
    const queryClient = useQueryClient();
    const {mutate , isPending, error} = useMutation({
      mutationFn: login,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['authUser'] });
      },
      onError: (error) => {
        console.error("Login error:", error);
        // Handle error appropriately, e.g., show a toast notification
      }
    });

    return { loginMutation : mutate, isPending, error };
}

export default useLogin;
