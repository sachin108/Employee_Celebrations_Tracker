"""
Django settings for Employee_Celebrations_Tracker project.

Generated by 'django-admin startproject' using Django 4.2.3.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""
import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-9p!7py0)n!phwdh&00vhci*)8q)%bc7@q=y+nmue1z7m2g%=l5'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'employee_data_service',
    'storages',
   'elasticapm.contrib.django'
]

MIDDLEWARE = [
    "elasticapm.contrib.django.middleware.TracingMiddleware",
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# configuration for integrating Elastic Application Performance 
# Monitoring (APM) with a Django web application
ELASTIC_APM = {
  'SERVICE_NAME': 'Django App',

  'SECRET_TOKEN': 'ktTXfZl26tM4KSacoH',

  'SERVER_URL': 'https://70b3b12f4f344b5599deee109317548b.apm.us-central1.gcp.cloud.es.io:443',

  'ENVIRONMENT': 'my-environment',

  'DEBUG': True,
}

ROOT_URLCONF = 'Employee_Celebrations_Tracker.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'elasticapm.contrib.django.context_processors.rum_tracing',            
            ],
        },
    },
]

# specifies the entry point for the WSGI (Web Server Gateway Interface) 
# application of your Django project.
WSGI_APPLICATION = 'Employee_Celebrations_Tracker.wsgi.application'



DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql', # or 'django.db.backends.mysql' for MySQL
        'NAME': 'djangoDB',
        'USER': 'admin',
        'PASSWORD': 'pns2F9xUCcB6Fbe',
        'HOST': 'database-1.cm0rqlp66vfh.us-west-2.rds.amazonaws.com',
        'PORT': '3306',
    }
}
'''

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
'''

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

#when you run Django management commands, Elastic APM will also capture performance data 
#and other relevant metrics for those commands
ELASTIC_APM["INSTRUMENT_DJANGO_MANAGEMENT_COMMANDS"] = True

LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s'
        },
    },
    'handlers': {
        'elasticapm': {
            'level': 'DEBUG',  # Change to your desired level (e.g., 'WARNING')
            'class': 'elasticapm.contrib.django.handlers.LoggingHandler',
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose'
        }
    },
    'loggers': {
        'django.db.backends': {
            'level': 'ERROR',
            'handlers': ['elasticapm'],
            'propagate': False,
        },
        'mysite': {
            'level': 'DEBUG',  # Change to your desired level (e.g., 'WARNING')
            'handlers': ['elasticapm'],
            'propagate': False,
        },
        'elasticapm.errors': {
            'level': 'ERROR',
            'handlers': ['elasticapm'],
            'propagate': False,
        },
    },
}


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = '/static/'

STATIC_ROOT = BASE_DIR/'static_root'

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]


DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
LOGIN_URL = 'login'  # Update with your login URL pattern name

