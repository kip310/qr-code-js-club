if (user) {
    const avatarImg = document.querySelector(".avatar-img");
    if (avatarImg && user.user_metadata?.avatar_url) {
      avatarImg.src = user.user_metadata.avatar_url;
    }
  }