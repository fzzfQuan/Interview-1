'use client';

import './home.css';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';

type FormValues = {
  mobile: string;
  code: string;
};


const useCountdown = (initialSeconds = 0) => {
  const [countdown, setCountdown] = useState(initialSeconds);
  
  // 开始倒计时的方法
  const startCountdown = (seconds: number) => {
    setCountdown(seconds);
  };
  
  // 处理倒计时逻辑
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);
  
  return {
    countdown,
    startCountdown,
    isRunning: countdown > 0
  };
};

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { countdown, startCountdown, isRunning } = useCountdown();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<FormValues>();
  

  const mobileValue = watch('mobile');
  const isMobileValid = mobileValue && /^1[3-9]\d{9}$/.test(mobileValue);
  
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    // 模拟接口请求，1秒后成功
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(data); // 打印表单数据
    setIsSubmitting(false);
  };
  
  const handleGetCode = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('获取验证码');
    startCountdown(60);
  };
  

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-item">
        <input 
          placeholder="手机号" 
          {...register('mobile', {
            required: '请输入手机号',
            pattern: {
              value: /^1[3-9]\d{9}$/,
              message: '手机号格式错误'
            }
          })} 
        />
        {errors.mobile && <p className="form-error">{errors.mobile.message}</p>}
      </div>

      <div className="form-item">
        <div className="input-group">
          <input 
            placeholder="验证码" 
            {...register('code', {
              required: '请输入验证码',
              pattern: {
                value: /^\d{6}$/,
                message: '验证码格式错误'
              }
            })} 
          />
          <button 
            className="getcode" 
            disabled={!isMobileValid || isRunning}
            onClick={handleGetCode}
          >
            {isRunning ? `${countdown}秒后重试` : '获取验证码'}
          </button>
        </div>
        {errors.code && <p className="form-error">{errors.code.message}</p>}
      </div>

      <button className="submit-btn" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'submiting......' : '登录'}
      </button>
    </form>
  );
}
