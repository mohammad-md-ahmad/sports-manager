<!--begin::Reset Password Form-->
<form method="POST" action="{{ route('password.update') }}" class="form w-100" novalidate="novalidate"
      id="kt_new_password_form">
    @csrf

    <!-- Password Reset Token -->
    <input type="hidden" name="token" value="{{ $token }}">

    <!--begin::Heading-->
    <div class="text-center mb-10">
        <!--begin::Title-->
        <h1 class="text-dark mb-3">
            {{ __('Update Your Password') }}
        </h1>
        <!--end::Title-->

        <!--begin::Link-->
        <div class="text-gray-400 fw-bold fs-4">
            {{ __('This is a secure area of the application. Please confirm your password before continuing.') }}
        </div>
        <!--end::Link-->
    </div>
    <!--begin::Heading-->

    <!--begin::Input group-->
    <div class="fv-row mb-10">
        <label class="form-label fw-bolder text-gray-900 fs-6">{{ __('Email') }}</label>
        <input class="form-control form-control-solid" type="email" name="email" autocomplete="off" tabindex="-1" readonly="readonly"
               value="{{ old('email', $request->email) }}" required />
    </div>
    <!--end::Input group-->

    <!--begin::Input group-->
    <div class="mb-10 fv-row" data-kt-password-meter="true">
        <!--begin::Wrapper-->
        <div class="mb-1">
            <!--begin::Label-->
            <label class="form-label fw-bolder text-dark fs-6">
                {{ __('Password') }}
            </label>
            <!--end::Label-->

            <!--begin::Input wrapper-->
            <div class="position-relative mb-3">
                <input class="form-control form-control-lg form-control-solid" type="password" name="password"
                       autocomplete="new-password" />
            </div>
            <!--end::Input wrapper-->
        </div>
        <!--end::Wrapper-->

        <!--begin::Hint-->
        <div class="text-muted">
            {{ __('Use 8 or more characters with a mix of letters, numbers & symbols.') }}
        </div>
        <!--end::Hint-->
    </div>
    <!--end::Input group--->

    <!--begin::Input group-->
    <div class="fv-row mb-10">
        <label class="form-label fw-bolder text-gray-900 fs-6">{{ __('Confirm Password') }}</label>
        <input class="form-control form-control-solid" type="password" name="password_confirmation"
               autocomplete="off" required />
    </div>
    <!--end::Input group-->

    <!--begin::Actions-->
    <div class="d-flex flex-wrap pb-lg-0">
        <div class="flex-fill">
            <a href="{{ route('login') }}" class="btn btn-lg btn-link fw-bolder">{{ __('Cancel') }}</a>
        </div>
        <button type="submit" class="btn btn-lg btn-primary fw-bolder flex-fill">
            <span class="indicator-label">
                {{ __('Submit') }}
            </span>
        </button>
    </div>
    <!--end::Actions-->
</form>
<!--end::Reset Password Form-->
