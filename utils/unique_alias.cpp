#include <utils/unique_alias.hpp>

#include <atomic>
#include <chrono>
#include <sstream>

static std::atomic<int> __counter(0);

utils::unique_alias::unique_alias()
{
    std::ostringstream s;

    s << "benchmarks-"
      << std::chrono::duration_cast<std::chrono::seconds>(
             std::chrono::steady_clock::now().time_since_epoch())
             .count()
      << "-" << __counter++ << "-000000";

    _string = s.str();
}

void utils::unique_alias::set_watermark(unsigned long iteration)
{
    size_t index = _string.size();
    for (int digit = 0; digit < 6; digit++)
    {
        _string[--index] = '0' + (iteration & 63);
        iteration /= 64;
    }
}
